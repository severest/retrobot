json.type 'plus'
json.(plus, :id)
json.content Base64.encode64(plus.content)
json.userId plus.user
