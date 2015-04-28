import os
from os import path
import json
import re


MyDir = "/home/web/benetou.fr/fabien/wiki.d/"
MyJSONfile = "Wiki.json"

MyWikiFiles = os.listdir(MyDir)

data = {}

""" Target format
    var Nodes = [
                 {Id:"PmWiki.Links", Group:"PmWiki", Label:"Links", Size:6064, Time:1161032541, Rev:5, Texture: "HomePage.png"},
                 {Id:"PmWiki.WikiWikiWeb", Group:"PmWiki", Label:"WikiWikiWeb", Size:6064, Time:1161032541, Rev:10, Texture: "JavaScript.png"},
                 {Id:"PmWiki.WikiSandbox", Group:"PmWiki", Label:"WikiSandbox", Size:6064, Time:1161032541, Rev:50, Texture: "3DVisualization.png"},
                 ];
    var Vertices = [
                    {FROM:"PmWiki.Links", TO:"PmWiki.WikiWikiWeb"},
                    {FROM:"PmWiki.Links", TO:"PmWiki.WikiSandbox"}
                    ];
"""
Nodes=[]
Vertices=[]
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
                revision = int(mr.groups()[0])
            if re.match("^ctime=", line):
                mt = re.search('^ctime=(.*)', line)
                ctime = int(mt.groups()[0])
            if re.match("^time=", line):
                mt = re.search('^time=(.*)', line)
                time = int(mt.groups()[0])
            if re.match("^targets=", line):
                mt = re.search('^targets=(.*)', line)
                targets = mt.groups()[0].split(",")
            if re.match("^text=", line):
                size = len(line)-5
        if not revision == "":
            Nodes.append({"Id": name, "Rev": revision, "Size": size, "ChangeTime": ctime, "Time": time})
        if not targets == "":
            Vertices.append({"FROM": name, "TO": targets})

data = {"Nodes": Nodes, "Vertices": Vertices}

with open(MyJSONfile, 'w') as outfile:
    json.dump(data, outfile)
