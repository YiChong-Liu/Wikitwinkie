#!/bin/bash
# usage: ./link_utils.sh [clean]

# This script should be run after cloning the repository if you are going to be developing in VS Code

# symlinks seem to change node import behavior, so we are using hard links to link the utils directory
# into each of the services. except directories cannot be hard linked, so we'll just hard link all the
# files individually

# Calling this script with no arguments will create the links, and calling it with the argument "clean"
# will delete the links

REPO_ROOT=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)

SERVICES=("accountmanagement" "article_vote" "comment_votes" "comments" "image_management" "sessions")

UTILS_FILES=("utils.ts" "interfaces.ts")

if [ "$1" = clean ]; then
    # delete the links
    for service in "${SERVICES[@]}"; do
        rm -r "$REPO_ROOT/$service/utils"
    done
else
    # create the links
    for service in "${SERVICES[@]}"; do
        mkdir "$REPO_ROOT/$service/utils"
        for fname in "${UTILS_FILES[@]}"; do
            ln "$REPO_ROOT/utils/$fname" "$REPO_ROOT/$service/utils/$fname"
        done
    done
fi
