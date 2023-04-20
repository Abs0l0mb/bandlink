'use strict';

export class ApiErrors { 

    static readonly ERRORS: {[key: string] : string} = {
        
        'not-found': 'A value is missing or incorrect',
        'string-error': 'Text expected',
        'short-string-error': 'Text expected',
        'long-string-error': 'Text expected',
        'address-error': 'The address is incorrect',
        'number-error': 'Number expected',
        'float-error': 'Float expected',
        'integer-error': 'A value is missing or incorrect',
        'boolean-error': 'Boolean expected',
        'object-error': 'Object expected',
        'percent-error': 'Percentage expected',
        'integer-json-array-error': 'Integer array expected',
        'hex-error': 'Hex string expected',
        'hex-color-error': 'Hex color code expected',
        'sha256-error': 'SHA256 expected',
        'phone-error': 'Phone is invalid',
        'email-error': 'Email is invalid',
        'password-error': 'Password is too short',
        'true-expected': 'True expected',
        'date-error': 'Date expected'
    }

    /*
    **
    **
    */
    static getMessage(error: string) : string | null {

        const message = ApiErrors.ERRORS[error];

        if (!message)
            return null;

        return message;
    }
}