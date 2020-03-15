#/bin/bash
rm -rf ./node_modules
rm yarn.lock
#rm package-lock.json

rm -rf ./packages/rift/node_modules
#rm -f ./packages/rift/package-lock.json
rm -f ./packages/rift/yarn.lock

rm -rf ./packages/rp2/node_modules
#rm -f ./packages/rp2/package-lock.json
#rm -f ./packages/rp2/yarn.lock

rm -rf ./packages/code-parser/node_modules
#rm -f ./packages/code-parser/package-lock.json
#rm -f ./packages/code-parser/yarn.lock