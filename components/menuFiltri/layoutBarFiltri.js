import { Box, Divider, Paper, Stack, Typography } from "@mui/material";

export default function LayoutBarFiltri({ icon, title, children }) {
  return (
    <div className="px-2">
           <div className="flex">
            
              {icon}
              <p className="text-gray-800 3xl:text-xl 3xl:ml-1  ">{title}</p>
              </div>
              <div style={{ alignItems: "flex-end"}}>
              {children}
              </div>
             
            
             
          
    </div>
  );
}
