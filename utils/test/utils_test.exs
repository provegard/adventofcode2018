defmodule UtilsTest do
  use ExUnit.Case
  doctest Utils

  test "readlines reads lines, stripping whitespace" do
    lines = Utils.readlines("test/lines.txt")
    assert lines == ["1", "2", "3"]
  end

  test "readlines_as_integers reads lines, converting to integers" do
    lines = Utils.readlines_as_integers("test/lines.txt")
    assert lines == [1, 2, 3]
  end

  test "to_tuples_via_regex" do
    assert Utils.to_tuples_via_regex(["a,c", "d,e"], ~r/(.*),(.*)/) == [{"a", "c"}, {"d", "e"}]
  end
end
