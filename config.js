module.exports = {
    apps: {
        hostname: '192.168.1.6',
        portnumber: 8080,
    },
    optins: {
        
    },
    mongo: {
        URL: "mongodb://localhost:27017/ALServer",
        native_parser: true,
        autoReconnect: true,
        poolSize: 4,
        
        admin: {
            // 관리 인증 기능을 설정하려면 true : true로 설정하면 아래 auth는 무시 됩니다.
            // 인증을 위해서 아래 adminUsername/adminPassword를 입력해야 합니다.
            admin: true,
            auth: [
                /*
                {
                    database: 'test',
                    username: 'user',
                    password: 'pass'
                }
                */
            ],
            
            // MongoDB 관리자 계정이 있다면 아래에 설정합니다. 없으면 비워두면 됩니다.
            adminUsername: 'admin',
            adminPassword: 'pass',
            whitelist: [], // 목록에 있는 사람을 제외하고 모든 데이터베이스를 숨깁니다.
            blacklist: []  // 아래 나열 된 데이터베이스 숨깁니다.
        }
    }
};