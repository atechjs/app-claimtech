import Layout from "../../components/layout";
import TanstackTable from "../../components/tanstackTable/tanstackTable";



export default function Page() {
    return (
        <div className="p-20">
      <TanstackTable />
      </div>
    );
}



Page.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
  };
  