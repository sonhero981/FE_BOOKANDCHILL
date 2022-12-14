import { Box, Button, Divider, IconButton, MenuItem, Snackbar, TextField } from "@material-ui/core"
import { CameraAlt, Clear } from "@material-ui/icons"
import { Fragment, useEffect } from "react"
import { useState } from "react"
import { HEROKU_API } from "../../../Services/Constants"
import { axiosDelete, axiosGet, axiosPatch, axiosPost, axiosPut } from "../../../Services/Ultils/axiosUtils"
import { OrangeButton } from "../../CustomComponent/OrangeButton"
import { WhiteButton } from "../../CustomComponent/WhiteButton"
import Alert from '@material-ui/lab/Alert';

const UpdateBookPage = () => {

  const [categories, setCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      let response = await axiosGet(`${HEROKU_API}/category`)
      if (!response) return
      setCategories(response.data)
    }
    getCategories()
  }, [])

  const [images, setImages] = useState([])

  const uploadImage = async (e) => {
    if (!e.target.files) {
      return
    }

    const blobFile = e.target.files[0]
    let formData = new FormData()
    formData.append('file', blobFile)
    let response = await axiosPost(`${HEROKU_API}/upload`, formData)
    if (!response || !response.success) return
    setImages(prev => ([...prev, response.data]))
    console.log(response.data)
  }

  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [publisher, setPublisher] = useState('')
  const [publicationDay, setPublicationDay] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState(0)
  const [description, setDesciption] = useState('')

  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSuccess, setAlertSuccess] = useState(false)

  const resetState = () => {
    setName('')
    setAuthor('')
    setPublisher('')
    setPublicationDay('')
    setManufacturer('')
    setPrice(0)
    setCategory('')
    setAmount(0)
    setDesciption('')
    setImages([])
  }

  const submit = async (e) => {
    e.preventDefault()

    if (!images.length) {
      setOpenAlert(true)
      setAlertMessage('B???n ch??a th??m ???nh')
      setAlertSuccess(false)
      return
    }

    console.log({
      "name": name,
      "description": description,
      "imageURL": images,
      "author": author,
      "publisher": publisher,
      "publication_day": publicationDay,
      " manufacturer": manufacturer,
      "price": price,
      "category": category,
      "amount": amount
    })

    let response = await axiosPut(`${HEROKU_API}/books/${id}`, {
      "name": name,
      "description": description,
      "imageURL": images,
      "author": author,
      "publisher": publisher,
      "publication_day": publicationDay,
      " manufacturer": manufacturer,
      "price": price,
      "category": category,
      "amount": amount
    }, true)

    console.log(response)

    setOpenAlert(true)
    if (!response || !response.success) {
      setAlertMessage('Update th???t b???i')
      setAlertSuccess(false)
    }
    else {
      setAlertMessage('Update th??nh c??ng')
      setAlertSuccess(true)
    }

  }

  const getData = async () => {
    let response = await axiosGet(`${HEROKU_API}/books/${id}`)
    if (!response || !response.success) {
      setOpenAlert(true)
      setAlertMessage('ID kh??ng t???n t???i')
      setAlertSuccess(false)
    }
    else {
      let data = response.data
      setAmount(data.amoun || 0)
      setAuthor(data.author || '')
      setCategory(data.category || '')
      setDesciption(data.description || '')
      setImages(data.imageURL || [])
      setManufacturer(data.manufacturer || '')
      setName(data.name || '')
      setPrice(data.price || 0)
      setPublicationDay(data.publication_date || '')
      setPublisher(data.publisher || '')
    }
  }

  const deleteBook = async () => {
    let response = await axiosDelete(`${HEROKU_API}/books/${id}`, null, true)
    setOpenAlert(true)
    if (!response || !response.success) {
      setAlertMessage('X??a th???t b???i')
      setAlertSuccess(false)
    } else {
      setAlertMessage('Xo?? th??nh c??ng')
      setAlertSuccess(true)
    }
  }

  return (
    <>
      <Box
        boxSizing='border-box'
        paddingTop={10}
        flexGrow={1}
        paddingX={2}
        display='flex'
        height='100%'
      >
        <Box
          // width='700px'
          flexGrow={1}
          maxWidth='700px'
          boxSizing='border-box'
        >
          <Box display='flex'>
            <TextField
              label='id'
              variant="outlined"
              fullWidth
              // size='small'
              value={id}
              onChange={(e) => { setId(e.target.value) }}
              required
            />
            <Box marginLeft={2} />
            <OrangeButton width='150px' onClick={getData}>
              Get data
            </OrangeButton>
            <Box marginLeft={1} />
            <WhiteButton width='150px' onClick={deleteBook}>
              Delete
            </WhiteButton>
          </Box>

          <Box marginTop={1.5} />
          <form onSubmit={submit}>

            <TextField
              label='name'
              variant="outlined"
              fullWidth
              // size='small'
              value={name}
              onChange={(e) => { setName(e.target.value) }}
              required
            />
            <Box marginTop={1.5} />
            <TextField
              label='author'
              variant="outlined"
              fullWidth
              // size='small'
              value={author}
              onChange={(e) => { setAuthor(e.target.value) }}
              required
            />
            <Box marginTop={1.5} />

            <TextField
              label='publisher'
              variant="outlined"
              fullWidth
              // size='small'
              value={publisher}
              onChange={(e) => { setPublisher(e.target.value) }}
              required
            />
            <Box marginTop={1.5} />

            <TextField
              label='publication_day'
              variant="outlined"
              fullWidth
              // size='small'
              value={publicationDay}
              onChange={(e) => { setPublicationDay(e.target.value) }}
            // required
            />
            <Box marginTop={1.5} />

            <TextField
              label='manufacturer'
              variant="outlined"
              fullWidth
              // size='small'
              value={manufacturer}
              onChange={(e) => { setManufacturer(e.target.value) }}
            // required
            />
            <Box marginTop={1.5} />

            <TextField
              label='price'
              variant="outlined"
              fullWidth
              // size='small'
              type='number'
              value={price}
              onChange={(e) => { setPrice(e.target.value) }}
              required
            />
            <Box marginTop={1.5} />

            <TextField
              label='category'
              variant="outlined"
              fullWidth
              // size='small'
              select
              value={category}
              onChange={(e) => { setCategory(e.target.value) }}
              required
            >
              {categories.map(cate =>
                <MenuItem
                  key={cate._id}
                  value={cate.idCategory}
                >{cate.name}</MenuItem>
              )}
            </TextField>
            <Box marginTop={1.5} />

            <TextField
              label='amount'
              variant="outlined"
              fullWidth
              // size='small'
              type='number'
              value={amount}
              onChange={(e) => { setAmount(e.target.value) }}
              required
            />
            <Box marginTop={1.5} />

            <TextField
              variant="outlined"
              label="description"
              // size='small'
              fullWidth
              multiline
              minRows={6}
              maxRows={6}
              value={description}
              onChange={(e) => { setDesciption(e.target.value) }}
            // required
            />

            <Box marginTop={2} />
            <OrangeButton
              type='submit'
              width='150px'
            >
              Submit
            </OrangeButton>
          </form>

        </Box>


        <Box marginX={2}>
          <Divider orientation="vertical" />
        </Box>

        <Box
          width='200px'
          display='flex'
          flexDirection='column'
          alignItems='center'
          height='100%'
        >

          <WhiteButton
            startIcon={<CameraAlt />}
            style={{ position: 'relative', marginRight: '18px' }}
            width='150px'
          >
            Th??m ???nh
            <input
              type="file"
              // accept="image/*"
              style={{ width: '100%', height: '100%', cursor: 'pointer', opacity: 0, position: 'absolute', top: 0, left: 0 }}
              onChange={uploadImage}
              id='upload-button'
            />
          </WhiteButton>


          <Box
            marginTop={2}
            width='100%'
            height='716px'
            style={{ overflowY: 'scroll' }}
            display='flex'
            flexDirection='column'
            alignItems='center'
          >
            {images.slice().reverse().map((image, index) =>
              <Fragment
                key={image}
              >
                <Box
                  minWidth='150px'
                  minHeight='150px'
                  width='150px'
                  height='150px'
                  border='1px solid black'
                  marginBottom={2}
                  position='relative'
                >
                  <img
                    src={`${image}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'fill',
                      objectPosition: 'center'
                    }}
                  />
                  <IconButton
                    style={{ position: 'absolute', right: 0, top: 0 }}
                    size='small'
                    onClick={() => setImages(prev => prev.filter(img => img !== image))}
                  ><Clear /></IconButton>
                </Box>
              </Fragment>
            )}
          </Box>

        </Box>
      </Box>

      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Alert onClose={() => setOpenAlert(false)}
          severity={alertSuccess ? 'success' : 'error'}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default UpdateBookPage