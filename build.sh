#! /bin/bash
macgap build --name Dicer --output ./app ./public
# To enable the "Inspect Element" right click:
defaults write com.Dicer WebKitDeveloperExtras TRUE
defaults write com.Dicer IncludeDebugMenu 1
