# Json Mount it Back (a response mocker that talk ZeroMQ)

It use 2 channel, in different ports:

* Imposter port (5553)
* mockedservices ports (multiple, user defined)

The imposter port is used to setup the service responder.

This tool use is to make a mocked service that talk over ZeroMQ channel.
Only REP service is supported now.
The messages exchanged conform to the json format: {cmd, data}
where cmd is a string, data is an object.

It is intended for a meshed protected network like in docker swarm without any
authentication mechanism required.

Commands are:

```
cmd: /service_rep_add
data: {
    "port": 1233,
    "requests": <see code/tests>
}
```

and reset

> cmd: /reset

with no data.

The mock part just reply accordingly to imposter setup

for type matches use this:
https://www.npmjs.com/package/jsonpath-plus

## tools

to create a docker container and run a sh inside

> ./build.sh localrun

to run additional shell

> ./build.sh localsh

the created container mount code/ as volume, usefull for developing


### TODO

also add RegExp match

for reference format see:
http://www.mbtest.org/docs/api/stubs

to consider:
https://github.com/m0x72/json-matchers/blob/master/test/test.spec.js
