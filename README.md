# Dunkin Donuts dashboard

# frontend
To start the client <br>
1.- Run npm ci from the root directory <br>
2.- Run npm start

# backend
To start the server <br>
1.-run npm ci from the root directory <br>
2.- Run API_KEY={your method API key} npm start <br>

# File schema
When uploading a file, a validation is being done so that we are sure that we are alwaya getting the same file structure and can extract the information correctly. <br>

<?xml version="1.0" encoding="UTF-8" ?>
<rows>
<row>
	<Employee>
		<DunkinId>EMP-208c8e79-8d85-4914-9a7a-8a899e67c530</DunkinId>
		<DunkinBranch>BRC-5a32e859-e91a-490c-b4f2-bce67695f30c</DunkinBranch>
		<FirstName>Madie</FirstName>
		<LastName>Funk</LastName>
		<DOB>12-13-2000</DOB>
		<PhoneNumber>+16473020450</PhoneNumber>
	</Employee>
	<Payor>
		<DunkinId>CORP-e4025d0e-0491-49ef-8284-2738c2d0a0cf</DunkinId>
		<ABARouting>148386123</ABARouting>
		<AccountNumber>12719660</AccountNumber>
		<Name>Dunkin' Donuts LLC</Name>
		<DBA>Dunkin' Donuts</DBA>
		<EIN>32120240</EIN>
		<Address>
			<Line1>999 Hayes Lights</Line1>
			<City>Kerlukemouth</City>
			<State>IA</State>
			<Zip>67485</Zip>
		</Address>
	</Payor>
	<Payee>
		<PlaidId>ins_116947</PlaidId>
		<LoanAccountNumber>91400799</LoanAccountNumber>
	</Payee>
	<Amount>$7.03</Amount>
</row>
<row>
	<Employee>
		<DunkinId>EMP-208c8e79-8d85-4914-9a7a-8a899e67c530</DunkinId>
		<DunkinBranch>BRC-5a32e859-e91a-490c-b4f2-bce67695f30c</DunkinBranch>
		<FirstName>Madie</FirstName>
		<LastName>Funk</LastName>
		<DOB>12-13-2000</DOB>
		<PhoneNumber>+16473020450</PhoneNumber>
	</Employee>
	<Payor>
		<DunkinId>CORP-e4025d0e-0491-49ef-8284-2738c2d0a0cf</DunkinId>
		<ABARouting>148386123</ABARouting>
		<AccountNumber>12719660</AccountNumber>
		<Name>Dunkin' Donuts LLC</Name>
		<DBA>Dunkin' Donuts</DBA>
		<EIN>32120240</EIN>
		<Address>
			<Line1>999 Hayes Lights</Line1>
			<City>Kerlukemouth</City>
			<State>IA</State>
			<Zip>67485</Zip>
		</Address>
	</Payor>
	<Payee>
		<PlaidId>ins_116947</PlaidId>
		<LoanAccountNumber>91400799</LoanAccountNumber>
	</Payee>
	<Amount>$7.03</Amount>
</row>
</rows>

