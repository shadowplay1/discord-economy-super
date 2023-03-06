#!/usr/bin/env sh

DEFAULT_ROOT_DIR_NAME="des-v2"
FALLBACK_ROOT_DIR_NAME="des-dev"

ROOT_DIR_NAME=$DEFAULT_ROOT_DIR_NAME

branch=$(git rev-parse --abbrev-ref HEAD)

# a function to check if the default directory (des-v2) exists
is_default_dir() {
    node -e "require('fs').existsSync('../${DEFAULT_ROOT_DIR_NAME}') ? process.exit(0) : process.exit(1)"
}

# if default directory doesn't exist, change the root dir name to fallback name
if ! is_default_dir; then
    ROOT_DIR_NAME=$FALLBACK_ROOT_DIR_NAME
fi


# a function to check if the current directory name is a root directory name (des-v2 or des-dev)
is_in_root_dir() {
    node -e "process.cwd().endsWith('${ROOT_DIR_NAME}') ? process.exit(0) : process.exit(1)"
}

# a function to check is the public repository directory exists (./des)
is_public_repo_dir_existing() {
    ls ./des > /dev/null 2>&1
}


# abort if not in root directory

if ! is_in_root_dir ; then
    echo "[!] Files could only be copied from a project root directory (./$ROOT_DIR_NAME)."
    echo "[!] Aborting..."
	echo

    exit 1
fi

# abort if public repository directory does not exist

if [ ! -d "./des" ]; then
    echo "[!] Public repository directory does not exist. Run ${PWD}/prepare.sh file to create it."
    echo "[!] Aborting..."
	echo

    exit 1
fi

read -p "[?] - Enter the commit message to submit in a public GitHub repository: " commit_message
echo

# lint the code before copying files and committing the changes

echo '[1/5] - Linting the source code...'
npm run lint:fix


# generate EconomyItems files

echo '[2/5] - Creating EconomyItems files...'

echo
ts-node ./scripts/economyItems.ts
echo


# copy repository root directories

echo '[3/5] - Copying the source code directories to the public repository...'

cp ./examples ./des -r
cp ./mongodb ./des -r
cp ./src ./des -r
cp ./typings ./des -r


# copy repository root files

echo '[4/5] - Copying the source code files to the public repository...'

cp ./README.md ./des/README.md
cp ./postinstall.js ./des/postinstall.js
cp ./package.json ./des/package.json
cp ./package-lock.json ./des/package-lock.json
cp ./LICENSE ./des/LICENSE
cp ./index.js ./des/index.js
cp ./EconomyItems.d.ts ./des/EconomyItems.d.ts
cp ./EconomyItems.js ./des/EconomyItems.js
cp ./.gitattributes ./des/.gitattributes
cp ./.eslintrc.js ./des/.eslintrc.js


# cd to `./des/` and do the commit to the public repository

cd ./des

# echo '1'
# read -p "[?] - Enter the commit message to submit in a public GitHub repository: " commit_message
# echo "commit message: $commit_message"
# echo '2'

# check for commit message to exist

if [ "${commit_message}" = "" ]; then
    echo '[!] Commit message cannot be empty.'
    echo "[!] Aborting..."
	echo

    exit 1
fi

echo '[5/5] - Committing the changes...'

# add, commit changes to the local repository and push changes to the public repository

git add .


# check if the commit was successful
is_commit_successful() {
    git commit -m "$commit_message" --no-verify > /dev/null 2>&1
}

# if the commit was not successful, tell the user about it and exit with error code 1
if ! is_commit_successful; then
    echo
    echo '[!] - Failed to commit to the local repository. See error details above.'
	echo

    exit 1
fi


echo
echo "Committed with message '$commit_message' to the branch '$branch' successfully!"
echo "The code is ready to be pushed into remote repository now."
echo

exit 0
