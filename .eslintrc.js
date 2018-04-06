module.exports = {

    plugins: [

        "react"

    ],
    extends: [
        
        "eslint:recommended",
        "plugin:react/recommended"

    ],
    env: {

        es6: true

    },
    parserOptions: {

        sourceType: "module",
        ecmaFeatures: {

            jsx: true,
            experimentalObjectRestSpread: true

        }

    },
    rules: {

        "react/prop-types": [ 0 ]

    }
    
};
