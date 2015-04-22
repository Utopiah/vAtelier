import os
from os import path
import json
import re


MyDir = "/home/web/benetou.fr/fabien/wiki.d/"
MyJSONfile = "Wiki.json"

MyWikiFiles = os.listdir(MyDir)

data = {}

for myfile in MyWikiFiles:
    with open(os.path.join(MyDir,myfile), encoding='ISO-8859-1') as f:
        name = ""
        revision = ""
        targets = ""
        for line in f:
            if re.match("^name=", line):
                mn = re.search('^name=(.*)', line)
                name = mn.groups()[0]
            if re.match("^rev=", line):
                mr = re.search('^rev=(.*)', line)
                revision = mr.groups()[0]
            if re.match("^targets=", line):
                mt = re.search('^targets=(.*)', line)
                targets = mt.groups()[0].split(",")
        if not name == "":
            print('ID:', name)
        if not revision == "":
            print(revision)
        if not targets == "":
            print(targets)

with open(MyJSONfile, 'w') as outfile:
    json.dump(data, outfile)
