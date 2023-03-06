#!/usr/bin/env sh

read -p "[?] Enter the package version to deploy the docs for: " package_version
echo

COMMIT_MESSAGE="docs: docs update for v${package_version}"

if [ package_version = '' ]; then
    echo 'Package version cannot be empty.'
    exit 1
fi


echo '[1/3] Generating the docs files...'

git fetch -p origin
git checkout docs

docgen --source ./src --custom ./docs/index.yml --output ./docs/$package_version.json > /dev/null 2>&1
docgen --source ./mongodb/src --custom ./docs/index.yml --output ./docs/$package_version-mongo.json > /dev/null 2>&1
cp ./docs/$package_version.json ./docs/master.json

cd ./docs-repo

echo '[2/3] Deploying the docs files...'

cp ../docs/$package_version.json ./$package_version.json
cp ../docs/master.json ./master.json
cp ../docs/$package_version-mongo.json ./$package_version-mongo.json

git add .
git commit -m "${COMMIT_MESSAGE}"
git push -u origin docs

echo '[3/3] Uploading the sources to the docs...'

git checkout "${package_version}" 

cp ../docs/general ./docs -r
cp ../src ./ -r

git add .
git commit -m "${COMMIT_MESSAGE}"
git push -u origin "${package_version}"


git checkout master

cp ../docs/general ./docs -r
cp ../src ./ -r

git add .
git commit -m "${COMMIT_MESSAGE}"
git push -u origin master


git checkout "${package_version}-mongo"

cp ../docs/general ./docs -r
cp ../mongodb/src ./mongodb -r

git add .
git commit -m "${COMMIT_MESSAGE}"
git push -u origin "${package_version}-mongo"


git checkout main
cd ..

echo
echo 'Done!'
exit 0
