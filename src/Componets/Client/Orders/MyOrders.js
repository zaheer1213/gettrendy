import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import { BASEURL } from "../Comman/CommanConstans";
import { useAuth } from "../../AuthContext/AuthContext";
import Footer from "../Footer/Footer";
import { Pagination, Stack } from "@mui/material";

const MyOrders = () => {
  const { userToken } = useAuth();
  const [allOrders, setAllOrders] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(11);
  const [page, setPage] = useState(1);

  const columnDefs = [
    {
      headerName: "Sr No",
      field: "sr",
      sortable: true,
      filter: true,
      editable: false,
    },
    {
      headerName: "Name",
      field: "name",
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: "Product Name",
      field: "name",
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: "Amount",
      field: "amount",
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: "Delivery Cost",
      field: "delivery_cost",
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: "Delivery Address",
      field: "delivery_address",
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: "Pin code",
      field: "pincode",
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: "Payment Type",
      field: "payment_type",
      sortable: true,
      filter: true,
      editable: true,
    },
  ];
  const defaultColDef = {
    flex: 1,
    minWidth: 150,
    resizable: true,
  };

  const getAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASEURL}/orders/my-orders?page=${page}&limit=${limit}`,
        {
          headers: {
            "x-access-token": userToken,
          },
        }
      );
      if (response.data) {
        console.log(response);
        setLoading(false);
        const dataWithSr = response.data.rows.map((item, index) => ({
          ...item,
          sr: (page - 1) * limit + index + 1,
        }));
        setAllOrders(dataWithSr);
        setTotalRows(response.data.count);
        setTotalPages(response.data.pages_count);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    getAllOrders();
  }, [page, limit]);
  return (
    <>
      <div
        className="container"
        style={{ marginTop: "200px", marginBottom: "20px" }}
      >
        <div className="row">
          <h3 className="mb-3" style={{ fontWeight: "bold" }}>
            My Orders
          </h3>
          <div
            className="ag-theme-quartz"
            style={{ height: 500, width: "100%" }}
          >
            <AgGridReact
              rowData={allOrders}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={false}
              paginationPageSize={limit}
              rowSelection="multiple"
            />
          </div>
          <div className="mt-4 d-flex justify-content-center">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                variant="outlined"
                className="custom-pagination"
              />
            </Stack>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
