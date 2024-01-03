import { Stack, Typography } from "@mui/material";
import StatoReclamo from "../../statoReclamo";
import TagIcon from "@mui/icons-material/Tag";
import Tag from "../../tag";

export default function RenderDatiReclamo({
  aperto,
  codiceTipologiaReclamo,
  numero,
  codiceReclamoCliente,
  tagList = [],
}) {
  const displayTagList = (tagList) => {
    const MAX = 2;
    if (tagList.length > MAX) {
      const primi = tagList.slice(0, MAX);
      const rimanenti = tagList.slice(MAX);
      return (
        <>
          {primi.map((tag) => (
            <Tag label={tag.descrizione} colore={tag.colore} />
          ))}
          <TagSet tagList={rimanenti} />
        </>
      );
    } else {
      return tagList.map((tag) => (
        <Tag label={tag.descrizione} colore={tag.colore} />
      ));
    }
  };

  return (
    <Stack direction={"column"}>
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent="flex-start"
        alignItems="center"
      >
        <StatoReclamo
          aperto={aperto}
          codiceTipologiaReclamo={codiceTipologiaReclamo}
        />
        <Stack
          direction={"row"}
          spacing={1}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Typography variant="body1" align="left" alignContent={"flex-start"}>
            <b>{numero}</b>
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent="flex-start"
        alignItems="center"
      >
        <TagIcon fontSize="small" />
        <Typography variant="body1" align="left" alignContent={"flex-start"}>
          {codiceReclamoCliente}
        </Typography>
      </Stack>
      <Stack direction={"row"} spacing={0.5}>
        {displayTagList(tagList)}
      </Stack>
    </Stack>
  );
}
