"use strict";

/**
 * @author Julien Da Corte
 */

const TypesEnum = Object.freeze({
    specials: '!@#$%^&*_+-?',
    lowercase:'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    all: ('!@#$%^&*_+-?abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
});

export default TypesEnum;
