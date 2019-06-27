json.type 'delta'
json.(delta, :id)
json.content Base64.encode64(delta.content)
json.userId delta.user
