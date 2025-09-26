import { Scholar } from "@/types";
import ScholarCard from "./ScholarCard";

interface ScholarListProps{
  scholars : Scholar[];
}

const ScholarList = ({scholars}: ScholarListProps)=>{
  return(
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {scholars.map(
      (scholar) =>
        scholar &&
        scholar.id && <ScholarCard key={scholar.id} scholar={scholar} />
    )}
    </div>
  );
};
export default ScholarList;
