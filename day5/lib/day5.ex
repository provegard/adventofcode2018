defmodule Day5 do

  def part1(polymer) do
    String.length(part1_str(polymer))
  end

  def part1_str(polymer) do
    chlist = String.to_charlist(polymer)
    new_chlist = react(chlist)
    to_string(new_chlist)
  end

  defp react(polymer) do
    new_polymer = react_one(polymer)
    if eqln(polymer, new_polymer), do: new_polymer, else: react(new_polymer)
  end

  defp react_one([]) do
    []
  end
  defp react_one(polymer) do
    rem1 = remove_diff_pol(polymer)
    if eqln(rem1, polymer) do
      # try one step in
      f2 = [hd polymer] ++ polymer
      rem2_x = remove_diff_pol(f2)
      Enum.drop(rem2_x, 1)
    else
      rem1
    end
  end

  defp remove_diff_pol(polymer) do
    chunked = Enum.chunk_every(polymer, 2)
    Enum.flat_map(chunked, &remove_diff_pol_one/1)
  end

  defp remove_diff_pol_one([a]) do
    [a]
  end
  defp remove_diff_pol_one([a, b]) do
    if different_polarity(a, b), do: [], else: [a, b]
  end

  defp eqln(a, b) do
    length(a) == length(b)
  end

  defp different_polarity(a, b) do
    a != b && String.upcase(to_string([a])) == String.upcase(to_string([b]))
  end

  defp same_polarity(a, b) do
    a == b || String.upcase(to_string([a])) == String.upcase(to_string([b]))
  end

  def part2(polymer) do
    chlist = String.to_charlist(polymer)
    unit_types = chlist |> Enum.map(fn u -> hd String.to_charlist(String.upcase(to_string([u]))) end) |> MapSet.new()
    all_reacted = unit_types |> Enum.map(fn u ->
      new_p = Enum.reject(chlist, fn x -> same_polarity(u, x) end)
      part1_str(to_string(new_p))
    end)
    min_one = all_reacted |> Enum.min_by(fn r -> String.length(r) end)
    String.length(min_one)
  end
end
