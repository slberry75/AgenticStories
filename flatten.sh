#!/bin/bash
for file in $(find . -name "*.*ts" -o -name "*.tsx" -o -name "*.*js" -o -name "*.jsx" -o -name "*.json" -o -name "*.yaml" -o -name "*.md" | grep -v "package-lock.json" | grep -v node_modules | grep -v templates | grep -v assets | grep -v "*.config*" | grep -v dist- | grep -v ".vscode" | grep -v "*.config.*" | grep -v README | grep -v flatten | sort); do
    echo "===> $file <=="
    cat $file
    echo "----------------------------------------"
    echo
done