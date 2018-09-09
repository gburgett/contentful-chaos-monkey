
import Run from './main'

Run({
})
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
  })