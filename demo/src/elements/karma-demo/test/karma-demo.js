/* eslint-env mocha */
/* global polymer expect */
/* eslint-disable no-unused-expressions */
suite('karma-demo', () => {
  let wc

  setup(done => {
    polymer.create('karma-demo', el => {
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
