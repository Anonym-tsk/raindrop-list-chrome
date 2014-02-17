#! /bin/sh

CURRENT_DIR="${PWD}"
DIR="$(cd "$(dirname "$0")" && pwd)"
TEMP_DIR="/tmp/raindrop-list-chrome"
VERSION="$(cat ""${DIR}"/manifest.json" | sed -n -e '/"version":/ s/^.*"\(.*\)".*/\1/p')"
ZIP_NAME="raindrop-list-chrome-"${VERSION}".zip"

git clone https://github.com/Anonym-tsk/raindrop-list-chrome.git "${TEMP_DIR}"
cd "${TEMP_DIR}"
git checkout master

rm -rf .git
rm css/*.sass
rm LICENSE
rm README.md
rm build.sh

zip -r "${ZIP_NAME}" *
mv "${ZIP_NAME}" "${CURRENT_DIR}"
cd "${CURRENT_DIR}"
rm -rf "${TEMP_DIR}"
