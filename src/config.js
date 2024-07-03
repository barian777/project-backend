import * as url from "url"

const config = {

    PORT : 8080,
    SERVER:"atlas_01",
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    get UPLOAD_DIR() {return `${this.DIRNAME}/public/img`},
    MONGODB_URI: 'mongodb+srv://coderB-E_53160:back-end2024@clustercoder.i90trov.mongodb.net/coder-53160',
    MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
    PRODUCTS_PER_PAGE: 5,
    SECRET: '&G5f#J8kT@9rZ1pL',
    GITHUB_CLIENT_ID: 'Iv23liWd1wwLpScySPxp',
    GITHUB_CLIENT_SECRET: '9479f8ad8b8749d4a55c23752090e8c453309c2f',
    GITHUB_CALLBACK_URL: 'http://localhost:8080/api/sessions/ghlogincallback'
}

export default config;
