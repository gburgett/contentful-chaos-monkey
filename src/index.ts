
import Run from './main'

// tslint:disable:no-console

Run({
  logger: console.log,
})
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
  })
