using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateLawDocumentTypeRequest
    {
	    public int id { get; set; }
	    public string name { get; set; }
	    public string description { get; set; }
	    public string code { get; set; }
	    public string name_kg { get; set; }
	    public string description_kg { get; set; }
    }
    public class UpdateLawDocumentTypeRequest
    {
	    public int id { get; set; }
	    public string name { get; set; }
	    public string description { get; set; }
	    public string code { get; set; }
	    public string name_kg { get; set; }
	    public string description_kg { get; set; }
    }
}