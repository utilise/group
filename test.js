var expect = require('chai').expect
  , client = require('client')
  , owner = require('owner')
  , group = require('./')
  , to = require('to')

describe('group', function() {

  it('should do nothing if no console', function() {
    var realConsole = owner.console
    delete owner.console
    expect(group('foo', function(){ realConsole.log('bar') })).to.be.not.ok
    owner.console = realConsole
  })

  it('should prefix function with group message (disabled)', function() {
    /* istanbul ignore next */
    if (!owner.console) return
    var realLog = owner.console.log
      , realConsole = owner.console
      , result = []

    owner.console.log = function(){ 
      result = result.concat(to.arr(arguments))
      realLog.apply && realLog.apply(realConsole, arguments) 
    } 

    group('foo', function(){
      ;[1,2,3].map(function(){ console.log('bar') })
    })

    expect(result).to.eql([ 
      '*****'
    , 'foo'
    , '*****'
    , 'bar'
    , 'bar'
    , 'bar'
    , '*****'
    , 'foo'
    , '*****' 
    ])

    owner.console = realConsole
  })

  it('should prefix function with group message (enabled)', function() {
    /* istanbul ignore next */
    if (!owner.console) return
    var realLog = owner.console.log
      , realConsole = owner.console
      , result = []
      , start = []
      , end = []

    owner.console.groupCollapsed = function(){ 
      start = start.concat(to.arr(arguments))
      realLog.apply && realLog.apply(realConsole, arguments) 
    } 

    owner.console.groupEnd = function(){ 
      end = end.concat(to.arr(arguments))
      realLog.apply && realLog.apply(realConsole, arguments) 
    } 

    owner.console.log = function(){ 
      result = result.concat(to.arr(arguments))
      realLog.apply && realLog.apply(realConsole, arguments) 
    } 

    group('foo', function(){
      ;[1,2,3].map(function(){ console.log('bar') })
    })

    expect(start).to.eql(['foo'])
    expect(result).to.eql([ 
      'bar'
    , 'bar'
    , 'bar'
    ])
    expect(end).to.eql(['foo'])
  
    owner.console = realConsole
  })

})