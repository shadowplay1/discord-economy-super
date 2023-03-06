#!/usr/bin/env sh

# script settings

GITHUB_USERNAME="shadowplay1"
GITHUB_TOKEN="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"

OUT_DIR_NAME="des"
DOCS_OUT_DIR_NAME="docs-repo"


echo '[1/3] Initializing Husky...'
npx husky install > /dev/null 2>&1


echo '[2/3] Insatlling the public repository...'

if [ ${GITHUB_TOKEN} == "" ]; then
    echo '[!] - GitHub token is not specified.'
    echo "[!] - Aborting..."

    exit 1
else
	if [ -d "./${OUT_DIR_NAME}" ]; then
		echo "- Repository out directory (./${OUT_DIR_NAME}) exists - overwriting..."
		rm -rf "${OUT_DIR_NAME}"
	fi


	git clone "https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/discord-economy-super.git" > /dev/null 2>&1
	eval "mv discord-economy-super ${PWD}/${OUT_DIR_NAME}"

	cd $OUT_DIR_NAME

	git config --unset-all remote.origin.url
	git config --add remote.origin.url "https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/discord-economy-super.git"

	cd ..

	echo '[3/3] Insatlling the docs repository...'

	if [ -d "./${DOCS_OUT_DIR_NAME}" ]; then
		echo "- Docs repository out directory (./${DOCS_OUT_DIR_NAME}) exists - overwriting..."
		rm -rf "${DOCS_OUT_DIR_NAME}"
	fi

	git clone "https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/test.git" > /dev/null 2>&1
	eval "mv test ${PWD}/${DOCS_OUT_DIR_NAME}"

	cd $DOCS_OUT_DIR_NAME

	git config --unset-all remote.origin.url
	git config --add remote.origin.url "https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/test.git"

	cd ..


	echo
	echo "Done."
fi
