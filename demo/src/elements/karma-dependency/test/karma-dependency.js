/* eslint-env mocha */
/* global polymer expect */
/* eslint-disable no-unused-expressions */
suite('karma-dependency', () => {
  let wc

  setup(done => {
    polymer.create('karma-dependency', el => {
      wc = el
      done()
    })
  })

  teardown(() => {
    polymer.clear()
  })

  test('exists', () => {
    expect(wc).to.be.ok
  })
})
