#!/bin/bash

DIRECTORY=`dirname $0`
INPUT_PROJECT=$1
INPUT_TAG=$2

if [ -z $INPUT_PROJECT ] 
then
  echo "<project> missing"
  echo "Usage: ${0} <project> <tag>"
  exit 1
fi

if [ -z $INPUT_TAG ] 
then
  echo "<tag> missing"
  echo "Usage: ${0} <project> <tag>"
  exit 1
fi

# Set archive name from arguments
ARCHIVE=template-${INPUT_PROJECT}-${INPUT_TAG}.zip

echo "::group::building ${ARCHIVE}"
echo "::debug::${ARCHIVE}"

# zip sources template-${PROJECT}-${TAG}.zip
zip -r ${ARCHIVE} . \
  -x "dist/*" \
  -x "node_modules/*" \
  -x ".git/*" \
  -x ".github/*" \
  -x "docker-compose.yml"

# Here we use echo to ouput the variables, usefull for to debug in github ui
echo "$PWD"
echo "$DIRECTORY"
echo "$GITHUB_WORKSPACE"

ls -lh $ARCHIVE

echo "::endgroup::"

echo "- ${INPUT_PROJECT^} ${INPUT_TAG} template built :rocket:" >> $GITHUB_STEP_SUMMARY

# This step is important, it set the "filepath" output variable
# Will be accessible in workflow
echo "::set-output name=filepath::${ARCHIVE}"
