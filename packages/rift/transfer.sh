export ANDROID="android"

function transferFolder {
	cp -R ./$1/. ../../rift/$1
}
function transfer {
	cp ./$1 ../../rift/$1
}

transfer "transfer.sh"
transfer "metro.config.js"
transfer ".watchmanconfig"
transferFolder "ios"
transferFolder $ANDROID
echo "done"