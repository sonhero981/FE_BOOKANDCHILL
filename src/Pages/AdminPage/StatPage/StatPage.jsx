import { Box, Button, Slide, Snackbar, TextField, Typography } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import { useEffect } from "react"
import { useState } from "react"
import { Line } from "react-chartjs-2"
import { HEROKU_API } from "../../../Services/Constants"
import { axiosGet } from "../../../Services/Ultils/axiosUtils"
import { numberWithCommas } from "../../../Services/Ultils/NumberUtils"
import Loading from "../../Loading"
import StatBox from "./StatBox"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  // plugins: {
  //   legend: {
  //     position: 'top',
  //   },
  //   title: {
  //     display: false,
  //     text: 'Doanh thu',
  //   },
  // },
};
const StatPage = () => {

  const [openAlert, setOpenAlert] = useState(false)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    const getChartData = async () => {
      let response = await axiosGet(`${HEROKU_API}/bill/graph`, null, true)
      const data = response.data.reverse()
      setChartData({
        labels: data.map(month => month.date),
        datasets: [
          {
            label: 'Doanh thu',
            data: data.map(month => month.totalRevenue),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ]
      })
    }
    getChartData()
  }, [])

  const getReport = async (startTime, endTime) => {
    setLoading(true)
    let response = await axiosGet(`${HEROKU_API}/bill/report`, {
      startTime,
      endTime
    }, true)
    setLoading(false)
    console.log(response.data)
    setReport(response.data)
  }

  useEffect(() => {
    getReport(0, new Date().getTime())
  }, [])

  const search = async () => {
    const start_time_str = document.getElementById('start-time').value
    const end_time_str = document.getElementById('end-time').value
    const startTime = new Date(start_time_str).getTime()
    const endTime = new Date(end_time_str).getTime()
    if (endTime < startTime) {
      setOpenAlert(true)
      return
    }
    getReport(startTime, endTime)
  }

  return (
    <>
      <Box
        boxSizing='border-box'
        paddingTop={10}
        flexGrow={1}
        paddingX={2}
        height='100%'
      // style={{backgroundColor: 'yellow'}}
      >
        <Box
          display='flex'
          alignItems='center'
          paddingLeft={3}
          boxSizing='border-box'
        >
          <Typography style={{ fontWeight: 'bold' }}>T???</Typography>
          <Box marginLeft={1} />
          <TextField
            id='start-time'
            label=''
            type='date'
            defaultValue={'2022-03-01'}
            variant="outlined"
            size='small'
            style={{ backgroundColor: 'white' }}
          />
          <Box marginLeft={1} />
          <Typography style={{ fontWeight: 'bold' }}>?????n</Typography>
          <Box marginLeft={1} />
          <TextField
            id='end-time'
            label=''
            type='date'
            defaultValue={new Date().toISOString().replace(/T.*/, '').split('-').join('-')}
            variant="outlined"
            size='small'
            style={{ backgroundColor: 'white' }}
          />
          <Box marginLeft={2} />
          <Button
            variant='contained'
            color='primary'
            style={{ backgroundColor: '#FE6384' }}
            // size='small'
            onClick={search}
          >
            T??m ki???m
          </Button>
        </Box>
        <Box
          display='flex'
          width='100%'
          gridColumnGap={40}
          boxSizing='border-box'
          paddingX={3}
          justifyContent='space-between'
          marginTop={4}
        >
          <StatBox name='????n ?????t h??ng' value={numberWithCommas(report?.numberOfBills)} color={0} />
          <StatBox name='S??ch ???????c b??n' value={numberWithCommas(report?.numberOfBooks)} color={1} />
          <StatBox name='Ng?????i mua' value={numberWithCommas(report?.numberOfBuyer)} color={2} />
          <StatBox name='Doanh thu' value={`${numberWithCommas(report?.totalRevenue)}??`} color={3} />
        </Box>

        {chartData &&
          <Box width='100%' height='fit-content' display='flex' justifyContent='center' marginY={4} boxSizing='border-box' paddingX={3}>
            <Box width='100%'>
              <Line options={options} data={chartData} />
            </Box>
          </Box>
        }

      </Box>
      <Snackbar
        open={openAlert}
        autoHideDuration={5000}
        onClose={() => { setOpenAlert(false) }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Slide direction="right">
          <Alert
            severity={'error'}
            elevation={6} variant="filled"
          >
            Ng??y k???t th??c c???n l???n h??n ng??y b???t ?????u
          </Alert>
        </Slide>
      </Snackbar>
      {loading && <Loading />}
    </>
  )
}

export default StatPage