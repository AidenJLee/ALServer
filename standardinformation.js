
module.exports = {
    apis : {
        users: {
            'POST': 'http://aidenjlee.example.com/v1/users', 
            'GET': 'http://aidenjlee.example.com/v1/users',
            'GETONE': 'http://aidenjlee.example.com/v1/users/:id',
            'PTU': 'http://aidenjlee.example.com/v1/users/:id',
            'DEL': 'http://aidenjlee.example.com/v1/users/:id'
        },
        gifts: {
            'POST': 'http://aidenjlee.example.com/v1/gifts', 
            'GET': 'http://aidenjlee.example.com/v1/gifts',
            'GETONE': 'http://aidenjlee.example.com/v1/gifts/:id',
            'PTU': 'http://aidenjlee.example.com/v1/gifts/:id',
            'DEL': 'http://aidenjlee.example.com/v1/gifts/:id'
        },
        extend: {
            'session': 'http://aidenjlee.example.com/v1/users/:id/session',
            'search': 'http://aidenjlee.example.com/v1/users/:id/gifts/search'
        }
    },
    common : {
        force_version: '1.0.1',
        current_version: '1.1.1',
        itunes_URL: ''
    },
    notice : {
        system : [],
        infomation : [],
    }
};
