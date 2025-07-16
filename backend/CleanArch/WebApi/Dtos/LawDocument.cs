using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateLawDocumentRequest
    {
	    public int id { get; set; }
	    public string name { get; set; }
	    public DateTime data { get; set; }
	    public string description { get; set; }
	    public int type_id { get; set; }
	    public string link { get; set; }
	    public string name_kg { get; set; }
	    public string description_kg { get; set; }
    }
    public class UpdateLawDocumentRequest
    {
	    public int id { get; set; }
	    public string name { get; set; }
	    public DateTime data { get; set; }
	    public string description { get; set; }
	    public int type_id { get; set; }
	    public string link { get; set; }
	    public string name_kg { get; set; }
	    public string description_kg { get; set; }
    }
}