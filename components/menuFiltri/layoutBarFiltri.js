import { Box, Divider, Paper, Stack, Typography } from "@mui/material";

export default function LayoutBarFiltri({ icon, title, children }) {
  return (
    <div className="">
      <Stack direction={"column"} className="">
        <Box
          sx={{
            display: "flex",
          }}
          pr={1}
          pl={1}
          className="mt-4 mb-2"
        >
          <div className="grid grid-cols-12 gap-4" >
            <div className="col-span-1" >
              {icon}
            </div>
            <div className="col-span-3 md:col-span-10 2xl:col-span-3" >
              <p className="text-gray-800 font-medium 2xl:text-xl ">{title}</p>
            </div>
            <div className="col-span-8 md:col-span-12 2xl:col-span-7" >
             {children}
            </div>
          </div>
        </Box>
        <Divider />
      </Stack>
    </div>
  );
}
