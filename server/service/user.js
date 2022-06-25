const sequelize = require('../util/index');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const uuid = require('uuid')
const tokenService = require('./token')
const UserDTO = require('../dtos/user')
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration(first_name, last_name, email, password){
        const candidate = await User.findOne({
            where: {email: email}
        });
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hash = await bcrypt.hash(password, 3);
        const createdId = uuid.v4();
        const user = await User.create({id: createdId, first_name: first_name, last_name: last_name, email: email, password_hash: hash});

        const userDTO = new UserDTO(user);
        const tokens = tokenService.generateTokens({...userDTO});
        await tokenService.saveRefreshToken(userDTO.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDTO
        }
    }

    async login(email, password) {
        await sequelize.sync();
        const user = await User.findOne({
            where: {email: email}
        });
        console.log(user);
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        console.log(password);
        console.log(user.password_hash)
        const isPassEqual = await bcrypt.compare(password, user.password_hash);
        if (!isPassEqual) {
            throw ApiError.BadRequest('Неверный пароль')
        }
        const userDTO = new UserDTO(user);
        const tokens = tokenService.generateTokens({...userDTO});
        await tokenService.saveRefreshToken(userDTO.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDTO
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (! userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await User.findOne({
            where: {id: tokenFromDb.userId}
        })
        const userDTO = new UserDTO(user);
        const tokens = tokenService.generateTokens({...userDTO});
        await tokenService.saveRefreshToken(userDTO.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDTO
        }
    }

    async getUsers() {
        const users = User.findAll();
        return users;
    }
}

module.exports = new UserService()