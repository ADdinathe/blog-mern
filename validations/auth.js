import { body } from 'express-validator'

export const registerValidation = [
    body('email', "Неверный формат почты").isEmail(),
    body('password', "пароль минимум 5 символов").isLength({min: 5}),
    body('fullName', "Укажите имя длиной не менее 3 символа").isLength({min: 3}),

    //TODO: потом вернуть а то какая-то хуйня при регистрации
    // body('avatarUrl', "Неверный формат ссылки").optional().isURL(),
];

export const loginValidation = [
    body('email', "Неверный формат почты").isEmail(),
    body('password', "пароль минимум 5 символов").isLength({min: 5}),
];



