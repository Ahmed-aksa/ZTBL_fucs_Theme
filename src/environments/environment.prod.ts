export const environment = {
    production: true,
    userInfoKey: 'ZTBLUser',
    userEmailKey: 'userEmail',
    userName: 'userName',
    menuBar: 'menuBar',
    userActivities: 'userActivities',
    Profile_id: '57',
    IsEncription: true,
    AesKey: 'abcdefghijklmnopqrstuvxwyz',
    isMockEnabled: true, // You have to switch this, when your real back-end is done
    authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',
    apiUrl: 'http://172.16.1.228:8070/ZTBL.Api', //aksa staging
    // apiUrl: 'http://10.1.103.102:8090/ZTBL.Api', //Ztbl DEV,
    // apiUrl: 'http://10.1.103.102:8091/UAT_APIS', //Ztbl UAT,
    // apiUrl: 'https://10.100.32.33', //Ztbl, //Production
    publicRSAKey: '-----BEGIN PUBLIC KEY-----\n' +
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3yl4HMI9P5i6cFmUCwg5\n' +
        'j/VwIHSLL1i13PkTLfzXhmcxMCJ9m9BqtQQ0HFAMAMvqbtbGVWjwV8uvPv2juRFj\n' +
        '59Y9hTgquyYOFjCKSuIweaccQoUmLX4vLHp9UrmjNOpjpyWJrOHP1pLu59gRmGVb\n' +
        'v3ZoiT7RmYL8NPk+nEg26h+98aug3xslyXHefZMAv8Yq4EO+qTH3WNE25q4Kh4Ph\n' +
        'hcumSNFSeyMBPaGDsee9eqd9BUp9rLg4pcRUQt4srhfl8jrh11JOIjL+PGcCMX0V\n' +
        'r71dUEHKTapOQJiD9fwWYXb2uKNqjbMo7BTjonOYSkXCGdtHkK7A4lOufX0ozj8P\n' +
        '9QIDAQAB\n' +
        '-----END PUBLIC KEY-----',

    /**
     * DEV
     */
    MCO_Group_ID: '56',//131694
    BM: '57',//80834
    RECOVERY_OFFICER: '206',//120203
    Regional_CHIEF: '203',//111573
    ZM: '69',//81426
    ZM_OPS: '181',//81426
    SVP_COD: '68',//112664
    ZC: '75',//54964
    PROVINCIAL_CHEIF: '205',//77345
    EVP_CD: '200',//112664
    SVP_RECOVERY: '199',//16284
    EVP_OD: '202',//116035
    EVP_RS: '201',//111537
    PZ: '204',//704000
    EVP_LMD: '207',//111537
    ZC_BAHAWALNAGAR: '75',//68174
    ZM_1: '75',//16284



    '56': 'Maker',
    '57': 'Branch Manager',
    '206': 'Recovery Officer',
    '203': 'Regional Chief',
    '69': 'Zonal Manager',
    '68': 'SVP COD',
    '75': 'Zonal Chief',
    '205': 'Provincial Chief',
    '200': 'EVP CD',
    '199': 'SVP Recovery',
    '202': 'EVP OD',
    '201': 'EVP RS',
    '204': 'President',
    '207': 'EVP LMD',
    '55': 'Super Admin',
    '60': 'Ho Monitoring',
    '67': 'BIOMET',
    '61': 'ZO MONITORING',
    '76': 'ZONAL COMMITTE',
    '181': 'ZONAL MANAGER OPS'


    /**
     * UAT
     */
    // MCO_Group_ID: '56',//131694
    // BM: '57',//80834
    // RECOVERY_OFFICER: '214',//120203
    // Regional_CHIEF: '206',//111573
    // ZM: '69',//81426
    // SVP_COD: '68',//112664
    // ZC: '75',//54964
    // PROVINCIAL_CHEIF: '208',//77345
    // EVP_CD: '211',//112664
    // SVP_RECOVERY: '213',//16284
    // EVP_OD: '209',//116035
    // EVP_RS: '210',//111537
    // PZ: '207',//704000
    // EVP_LMD: '212',//111537
    // ZM_CAD: '78',//81426
    // '56': 'Maker',
    // '57': 'Branch Manager',
    // '214': 'Recovery Officer',
    // '206': 'Regional Chief',
    // '69': 'Zonal Manager',
    // '68': 'SVP COD',
    // '75': 'Zonal Chief',
    // '208': 'Provincial Chief',
    // '211': 'EVP CD',
    // '213': 'SVP Recovery',
    // '209': 'EVP OD',
    // '210': 'EVP RS',
    // '207': 'President',
    // '212': 'EVP LMD',
    // '55': 'Super Admin',
    // '60': 'Ho Monitoring',
    // '67': 'BIOMET',
    // '61': 'ZO MONITORING',
    // '76': 'ZONAL COMMITTE',
    // '78': 'ZONAL MANAGER CAD'



    /**
     * Production
     */

    // MCO_Group_ID: '56',//131694
    // BM: '57',//80834
    // RECOVERY_OFFICER: '206',//120203
    // Regional_CHIEF: '211',//111573
    // ZM: '69',//81426
    // SVP_COD: '68',//112664
    // ZC: '75',//54964
    // PROVINCIAL_CHEIF: '210',//77345
    // EVP_CD: '215',//112664
    // SVP_RECOVERY: '208',//16284
    // EVP_OD: '213',//116035
    // EVP_RS: '214',//111537
    // PZ: '212',//704000
    // EVP_LMD: '209',//111537
    // ZM_CAD: '78',//81426
    // '56': 'Maker',
    // '57': 'Branch Manager',
    // '206': 'Recovery Officer',
    // '211': 'Regional Chief',
    // '69': 'Zonal Manager',
    // '68': 'SVP COD',
    // '75': 'Zonal Chief',
    // '210': 'Provincial Chief',
    // '215': 'EVP CD',
    // '208': 'SVP Recovery',
    // '213': 'EVP OD',
    // '214': 'EVP RS',
    // '212': 'President',
    // '209': 'EVP LMD',
    // '55':'Super Admin',
    // '60':'Ho Monitoring',
    // '67':'BIOMET',
    // '61': 'ZO MONITORING',
    // '76': 'ZONAL COMMITTE',
    // '78': 'ZONAL MANAGER CAD'

};
