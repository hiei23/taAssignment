export function filterType(type, applicants, filterStatus) {

	switch(type)
	{
		default: 
			return {
					type:"FILTER_APPLICANT", 
					payload: applicants, 
					filterStatus
				};
	}
}