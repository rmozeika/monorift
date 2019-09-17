var Repository = require('./repository.js');
const parser = require('parse-function');
const clone = require('git-clone');
const textract = require('textract');
const path = require('path');
const esprima = require('esprima');

const collection = 'code';

class CodeRepository extends Repository {
    constructor(api) {
        super(api, collection);
        const test = this.clone().then((res)=> {
            console.log(res)
        });

        // this.findByUsername.bind(this);
    }
    parseCode(input) {
        return input;
    }
    clone(repo) {
        return new Promise((resolve, reject) =>{
            const file = path.join(__dirname, 'tmp', 'temp.js');
            textract.fromFileWithPath(file, function( error, text ) {
                console.log(text);
                try {
                    const parsed = esprima.parseScript(text, { range: true });
                    const tokenized = esprima.tokenize(text);
                    const app = parser({
                        ecmaVersion: 2017
                    });
                    const mappedFunctions = parsed.body.map(({ type, range }) => {
                        if (type !== "FunctionDeclaration") {
                            return null
                        }
                        return text.substr(range[0], range[1]);
                    })
                    const result = mappedFunctions.map(str => {
                        return {
                            parsed: app.parse(str),
                            raw: str
                        }
                    });
                    resolve(result);
                } catch(e) {
                    console.log(e);
                    reject(e);
                }
            })
        })    
    }
}

module.exports = CodeRepository;
