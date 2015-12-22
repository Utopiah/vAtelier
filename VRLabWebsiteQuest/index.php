<html>
<head>
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.0.0/styles/default.min.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.0.0/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
</head>
<style>
body {
    top : 0;
    left    : 0;
    background-color:black;
    color:white;
    margin  : 0;
    padding : 0;
    overflow: hidden;
}
iframe#background {
    z-index : -9999;
    position: absolute;
    top : 0;
    left    : 0;
    width   : 100%;
    height  : 100%;
    margin  : 0;
    padding : 0;
    overflow: hidden;
}
iframe#inline {
    z-index : -9998;
    width   : 40%;
    height  : 300px;
    margin  : 40px;
    padding : 0;
    overflow: hidden;
    opacity: 0.5;
    float: left;
}
code {
    float: right;
    width   : 40%;
    height  : 300px;
    margin  : 40px;
}
#content {
    height: 55%;
    opacity: 0.9;
    background-color:white;
    color:black;
}
</style>
<iframe id="background" src="./Background/"></iframe> 
<body>
<center><img src="http://photos1.meetupstatic.com/photos/theme_head/b/5/c/0/full_6946528.jpeg"/></center>
<br/>
<br/>
<br/>
<div id="content">
<pre>

- welcome to the VRLab Brussels (shows as a background a random rotating object from the area e.g. <a href="https://grabcad.com/library/atomium/files">Atomium</a>, Grande Place, etc)
- try the first workshop quest, either on your own or during our next workshop (<a href="http://www.meetup.com/VR-LAB-Brussels/events/227439481/">13th of January 2016</a>)
-- broken webVR demo on half of the screen with 5 key steps to fix as a personnalized modifiable space (cf generate demo)
- consider learning how to interact with some of the hardware we have
-- hardware item 1 e.g. RevolVR http://revolvr.co
-- hardware item 2 e.g. VicoVR http://vicovr.com
</pre>
<div id="matching">
<iframe id="inline" src="./Background/"></iframe>
<pre>
<code><?php readfile("./Background/edits.js");?>
</code>
</pre>
</div>
</div>
</body>
</html>
