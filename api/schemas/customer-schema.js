export const customerSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Generated schema for Root",
    "type": "object",
    "properties": {
        "firstName": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
        },
        "lastName": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
        },
        "middleName": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
        },
        "birthday": {
            "type": "string",
            "pattern":"^\\d{2}-\\d{2}-\\d{4}$"
        },
        "email": {
            "type": "string",
            "format": "email"
        },
        "phone": {
            "type": "string",
            "pattern":"^\\d{10,11}$"
        },
        "addresses": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "streetNumber": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 10
                    },
                    "street": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 100
                    },
                    "ward": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 100
                    },
                    "district": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 100
                    },
                    "city": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 100
                    },
                    "state": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 100
                    },
                    "zip": {
                        "type": "string",
                        "pattern":"^\\d{5}(?:-\\d{4})?$"
                    },
                    "country": {
                        "type": "string",
                        "minLength": 2,
                        "maxLength": 2,
                        "pattern":"^[A-Z]{2}$"
                    }
                },
                "required": [
                    "streetNumber",
                    "street",
                    "ward",
                    "district",
                    "city",
                    "state",
                    "zip",
                    "country"
                ]
            }
        }
    },
    "required": [
        "firstName",
        "lastName",
        "birthday",
        "email",
        "phone"
    ]
};