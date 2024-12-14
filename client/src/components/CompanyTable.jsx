import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table';
import { Button } from './ui/button';

export function CompanyTable({ data, onPageChange, isCompany, totalPages, currentPage }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {isCompany ? (
              <>
                <TableHead>Industry</TableHead>
                <TableHead>Location</TableHead>
              </>
            ) : (
              <>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.name}</TableCell>
              {isCompany ? (
                <>
                  <TableCell>{item.industry}</TableCell>
                  <TableCell>{item.location}</TableCell>
                </>
              ) : (
                <>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.role}</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-4">
        <Button 
          onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button 
          onClick={() => onPageChange(prev => prev + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      <div className="mt-2 text-center">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}