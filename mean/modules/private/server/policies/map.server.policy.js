"use strict";var acl=require("acl");acl=new acl(new acl.memoryBackend),exports.invokeRolesPolicies=function(){acl.allow([{roles:["admin","user"],allows:[{resources:"/:layerName",permissions:"*"},{resources:"/:layerName/:objectId",permissions:"*"}]}])},exports.isAllowed=function(e,s,r){if(!e.user)return s.status(401).send("Unexpected null user error");var o=e.user.roles;acl.areAnyRolesAllowed(o,e.route.path,e.method.toLowerCase(),function(e,o){return e?s.status(500).send("Unexpected authorization error"):o?r():s.status(403).json({message:"User is not authorized"})})};