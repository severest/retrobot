require 'test_helper'

class TeamControllerTest < ActionDispatch::IntegrationTest
  test "get team summary" do
    post '/api/team/summary', params: { team: { name: 'team one' } }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 2, json_response['retros'].count
  end

  test "summary should not show in progess or voting retros" do
    post '/api/team/summary', params: { team: { name: 'permissions' } }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 0, json_response['retros'].count
  end

  test "team summary denied with no password" do
    post '/api/team/summary', params: { team: { name: 'test team' } }
    assert_response :unauthorized
  end

  test "team summary nonexistant" do
    post '/api/team/summary', params: { team: { name: 'nonexistant' } }
    assert_response :not_found
  end

  test "team summary with password" do
    post '/api/team/summary', params: { team: { name: 'test team', password: 'testpassword' } }
    assert_response :success
  end
end
