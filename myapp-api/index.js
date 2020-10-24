const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.json([{
      name:'AM',
      email: 'am@gmail.com'
  },
  {
    name:'PM',
    email: 'pm@email.com'
},
{
  name:'DM',
  email: 'dm@yourmail.com'
}


])
})

app.listen(port, () => {
  console.log(`This app listening at http://localhost:${port}`)
})