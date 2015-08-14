var content = null;
var blockNodes = ["h1", "h2", "h3", "p", "div"];
var inlineNodes = ["b", "i", "u", "span"];

function nodeInfo(node, level)
{
	var r = "";
	if(level == undefined)
	{
		level = 0;
		r += "\n";
	}
	var pad = "";
	for(var i = 0; i < level; i++)
	{
		pad += "      ";
	}
	if(node.nodeType == 3)
	{
		r += "\"" + node.nodeValue + "\"\n";
	}
	else
	{
		r += node.nodeName + "\n";
		for(var i in node.childNodes)
		{
			if(!node.childNodes.hasOwnProperty(i))
			{
				continue;
			}
			r += pad + "[" + i + "] : ";
			r += nodeInfo(node.childNodes[i], level + 1);
		}
	}
	return r;
}

function logRange(range)
{
	console.dir({startContainer: range.startContainer, startOffset: range.startOffset, endContainer: range.endContainer, endOffset: range.endOffset});
}

function isNodeInContent(node)
{
	if(node == null)
	{
		return false;
	}
	while(node.parentElement != null)
	{
		if(node.parentElement.id == 'content')
		{
			return true;
		}
		node = node.parentElement;
	}
	return false;
}

function isNodeABlock(node)
{
	return node != null && node.nodeType == 1 && blockNodes.indexOf(node.tagName.toLowerCase()) != -1;
}

function getCursor()
{
	return window.getSelection().getRangeAt(0);
}

function fixRangePoint(container, offset) // returns an object {container, offset} that is in a text node
{
	var r = {};
	if(container.nodeType == 3) // already a text node
	{
		r.container = container;
		r.offset = offset;
	}
	else // element node
	{
		if(offset < container.childNodes.length)
		{
			r.container = container.childNodes[offset];
			while(r.container.nodeType != 3)
			{
				if(r.container.firstChild == null)
				{
					r.container.appendChild(document.createTextNode(''));
				}
				r.container = r.container.firstChild;
			}
			r.offset = 0;
		}
		else
		{
			r.container = container;
			while(r.container.nodeType != 3)
			{
				if(r.container.lastChild == null)
				{
					r.container.appendChild(document.createTextNode(''));
				}
				r.container = r.container.lastChild;
			}
			r.offset = r.container.nodeValue.length;
		}
	}
	return r;
}

function fixRange(range) // fixes a range to use start and end in text nodes
{
	var startPoint = fixRangePoint(range.startContainer, range.startOffset);
	var endPoint = fixRangePoint(range.endContainer, range.endOffset);
	range.setStart(startPoint.container, startPoint.offset);
	range.setEnd(endPoint.container, endPoint.offset);
}

function getBlockOfNode(node)
{
	if(!content.contains(node))
	{
		return null;
	}
	while(!isNodeABlock(node))
	{
		node = node.parentElement;
	}
	return node;
}

function getBlockAtCursor()
{
	return getBlockOfNode(window.getSelection().anchorNode);
}

function setCursor(range)
{
	var selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);
}

function setCursorAtBlock(block)
{
	var range = document.createRange();
	range.selectNodeContents(block);
	range.collapse(true);
	setCursor(range);
}

function setCursorAtEndOfBlock(block)
{
	var range = document.createRange();
	range.selectNodeContents(block);
	range.collapse(false);
	setCursor(range);
}

function setBlockType(node, type, classes)
{
	var oldNode = node;
	var parentNode = oldNode.parentElement;
	var newNode = document.createElement(type);
	newNode.innerHTML = oldNode.innerHTML;
	if(classes != null)
	{
		for(var i in classes)
		{
			newNode.className += classes[i];
		}
	}
	parentNode.replaceChild(newNode, oldNode);
	setCursorAtBlock(newNode);
}

function setBlockTypeAtCursor(type, classes)
{
	setBlockType(getBlockOfNode(window.getSelection().anchorNode), type, classes);
}

function splitBlock(range)
{
	range.deleteContents();
	fixRange(range);

	var firstRange = range.cloneRange();
	var secondRange = range.cloneRange();
	var newRange = range.cloneRange();
	var block = getBlockOfNode(firstRange.startContainer);

	firstRange.setStartBefore(block);
	secondRange.setEndAfter(block);
	firstFragment = firstRange.cloneContents();
	secondFragment = secondRange.cloneContents();
	range.setStartBefore(block);
	range.setEndAfter(block);
	range.deleteContents();
	range.insertNode(secondFragment);
	range.insertNode(firstFragment);

	range.setStart(range.startContainer, range.startOffset + 1);
	range.collapse(true);
	fixRange(range);

	block = getBlockOfNode(range.startContainer);
	console.dir(block);
	fixNode(block);
	fixNode(block.previousSibling);

	setCursor(range);
}

function joinBlocks(range)
{
	var startContainer = range.startContainer;
	var startOffset = range.startOffset;
	var startBlock = getBlockOfNode(range.startContainer);
	var endBlock = getBlockOfNode(range.endContainer);
	range.deleteContents();
	fixRange(range);
	if(startBlock != endBlock)
	{
		// move children of endBlock to startBlock
		while(endBlock.childNodes.length > 0)
		{
			startBlock.appendChild(endBlock.firstChild);
		}
		startBlock.normalize();
		endBlock.parentNode.removeChild(endBlock);
	}
	range.setStart(startContainer, startOffset);
	range.collapse(true);
	setCursor(range);
}

function insertChar(range, c)
{
	range.deleteContents();
	fixRange(range);
	
	var textNode = range.startContainer;
	var offset = range.startOffset;
	
	if(textNode.nodeValue == '\u200b')
	{
		range.startContainer.nodeValue = String.fromCharCode(c);
	}
	else
	{
		range.startContainer.nodeValue = textNode.nodeValue.substr(0, offset) + String.fromCharCode(c) + textNode.nodeValue.substr(offset);
	}
	fixRange(range);

	range.setStart(textNode, offset + 1);
	range.collapse(true);
	setCursor(range);
}

function save()
{
	var html = $('#content').html();
	console.log('save.php?ps=' + password + '&n=' + note);
	$.post('save.php?ps=' + password + '&n=' + note, "t=" + encodeURIComponent(html));
}

function insertChildElement(parent, tag, beforeSibling)
{
	if(tag == 'text')
	{
		var node = document.createTextNode('\u200b');
	}
	else
	{
		var node = document.createElement(tag);
	}
	if(beforeSibling != null)
	{
		parent.insertBefore(node, beforeSibling);
	}
	else
	{
		parent.appendChild(node);
	}
}

function fixNode(node)
{
	if(node.nodeType == 3) // text
	{
		if(node.nodeValue == '')
		{
			node.nodeValue = '\u200b';
		}
	}
	else // element
	{
		if(node == content)
		{
			for(var i = 0; i < node.childNodes.length; i++)
			{
				if(node.childNodes[i].nodeType == 3) // remove any text nodes from the content div childNodes. only elements should be there
				{
					node.removeChild(node.childNodes[i]);
					i--;
				}
			}
			if(node.childNodes.length == 0) // make sure empty content has at least a <p> element
			{
				insertChildElement(node, 'p');
			}
		}
		for(var i = 0; i < node.childNodes.length; i++)
		{
			fixNode(node.childNodes[i]);
		}
		if(node.childNodes.length == 0) // make sure empty element has at least a text node
		{
			insertChildElement(node.firstChild, 'text'); 
		}
	}
}

$(document).ready(function()
{
	content = $('#content').get(0);
	fixNode(content);
	if(isNodeInContent(window.getSelection().anchorNode) == false)
	{
		setCursorAtBlock(content.children[0]);
	}
	$('#content').keydown(function(e)
	{
		var range = window.getSelection().getRangeAt(0);
		fixRange(range);
		if(e.keyCode == 8) // backspace
		{
			if(range.collapsed) // move start back one space or to previous node
			{
				if(range.startOffset > 0) // simply move cursor one back in text node
				{
					range.setStart(range.startContainer, range.startOffset - 1);
				}
				else // move cursor back to previous node in node tree
				{
					var startContainer = range.startContainer;
					while(startContainer.previousSibling == null)
					{
						if(startContainer.parentNode == content) // we're at the beginning of the content, so don't do anything
						{
							return false;
						}
						startContainer = startContainer.parentNode;
					}
					startContainer = startContainer.previousSibling;
					while(startContainer.lastChild != null)
					{
						startContainer = startContainer.lastChild;
					}
					range.setStart(startContainer, startContainer.nodeValue.length);
					fixRange(range);
				}
			}
			joinBlocks(range);
			return false;
		}
		else if(e.keyCode == 9) // tab
		{
			insertChar(range, 9);
			return false;
		}
		else if(e.keyCode == 46) // delete
		{
			if(range.collapsed) // move end forward one space or to next node
			{
				if(range.endOffset < range.endContainer.nodeValue.length) // simply move cursor one forward in text node
				{
					range.setEnd(range.endContainer, range.endOffset + 1);
				}
				else // move cursor forward to next node in node tree
				{
					var endContainer = range.endContainer;
					while(endContainer.nextSibling == null)
					{
						if(endContainer.parentNode == content) // we're at the end of the content, so don't do anything
						{
							return false;
						}
						endContainer = endContainer.parentNode;
					}
					endContainer = endContainer.nextSibling;
					while(endContainer.firstChild != null)
					{
						endContainer = endContainer.firstChild;
					}
					range.setEnd(endContainer, 0);
					fixRange(range);
				}
			}
			joinBlocks(range);
			return false;
		}
	});
	$('#content').keypress(function(e)
	{
		var range = window.getSelection().getRangeAt(0);
		fixRange(range);
		if(e.keyCode == 13) // enter
		{
			splitBlock(range);
		}
		else // character
		{
			insertChar(range, e.charCode);
		}
		return false;
	});
});

