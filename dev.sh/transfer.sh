# mv ./packages/rp2/Dockerfile ./packages/devops/Dockerfile 
src=$1
dir=$2
echo $src
echo $dir
function transfer () {
    echo "transfer arg" + $1
    mv ./packages/$src/$1 ./packages/$dir/$1

    # if [[ $a == z* ]]
    # # then
    # # mv -r ./packages/$src/$1 ./packages/$dir/$1
    # # return
    # fi
}

shift
shift
transfer "$@"