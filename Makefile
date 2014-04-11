install:
	npm install

upload:
	# sync all the files
	rsync -rav -e ssh --delete --exclude-from config/exclude.txt . root@dev.orbit.al:~/spoticka

deploy: upload
	# run the remote commands
	ssh -t root@dev.orbit.al "cd ~/spoticka && bash config/deploy.sh"
